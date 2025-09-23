import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase, Profile } from '@/lib/supabase'
import { User, Session } from '@supabase/supabase-js'

interface UserStore {
    user: User | null
    profile: Profile | null
    session: Session | null
    loading: boolean
    isAdmin: boolean
    setUser: (user: User | null) => void
    setProfile: (profile: Profile | null) => void
    setSession: (session: Session | null) => void
    setLoading: (loading: boolean) => void
    fetchProfile: (userId: string) => Promise<void>
    signIn: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    hydrate: () => Promise<void>
}

export const useUserStore = create<UserStore>()(
    persist(
        (set, get) => ({
            user: null,
            profile: null,
            session: null,
            loading: true,
            isAdmin: false,
            setUser: (user) => set({ user }),
            setProfile: (profile) => set({ profile, isAdmin: profile?.role === 'admin' || profile?.isAdmin === true }),
            setSession: (session) => set({ session }),
            setLoading: (loading) => set({ loading }),
            fetchProfile: async (userId: string) => {
                set({ loading: true })
                const { data, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single()
                if (error || !data) {
                    set({ profile: null, isAdmin: false })
                } else {
                    set({ profile: { ...data, isAdmin: data.role === 'admin' || data.isAdmin === true }, isAdmin: data.role === 'admin' || data.isAdmin === true })
                }
                set({ loading: false })
            },
            signIn: async (email, password) => {
                set({ loading: true })
                const { data, error } = await supabase.auth.signInWithPassword({ email, password })
                if (error || !data.user) throw error
                set({ user: data.user, session: data.session })
                await get().fetchProfile(data.user.id)
                set({ loading: false })
            },
            signOut: async () => {
                set({ loading: true })
                await supabase.auth.signOut()
                set({ user: null, profile: null, session: null, isAdmin: false, loading: false })
                localStorage.removeItem('user-store')
            },
            hydrate: async () => {
                set({ loading: true })
                const { data: { session } } = await supabase.auth.getSession()
                if (session?.user) {
                    set({ user: session.user, session })
                    await get().fetchProfile(session.user.id)
                } else {
                    set({ user: null, profile: null, session: null, isAdmin: false })
                }
                set({ loading: false })
            }
        }),
        { name: 'user-store' }
    )
)