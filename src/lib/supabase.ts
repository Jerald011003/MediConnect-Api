import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  full_name: string | null
  email: string | null
  role: 'patient' | 'doctor' | 'admin'
  created_at: string
  updated_at: string
  address: string | null
  postal_code: string | null
  date_of_birth: string | null
  gender: 'male' | 'female' | 'other' | null
  contact_number: string | null
  verification_id: string | null
  availability_days: string[] | null
  availability_times: string[] | null
  profile_picture_url: string | null
  isAdmin?: boolean
}

export interface Verification {
  id: string
  user_id: string
  created_at: string
  updated_at: string
  primary_id_back: string | null
  secondary_id_type: string | null
  secondary_id_image: string | null
  selfie_image: string | null
  status: 'pending' | 'verified' | 'rejected'
  reviewer_notes: string | null
  primary_id_type: string | null
  primary_id_front: string | null
  profiles?: Profile
}

export interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  date: string
  time: string
  created_at: string
  updated_at: string
  notes: string | null
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled' | 'no_show'
  reason: string | null
  type: 'in_person' | 'teleconsultation'
  cancellation_count: number
  late_flag: boolean
  is_cancelled: boolean
  cancellation_date: string | null
  cancellation_time: string | null
  cancellation_count_met_at: string | null
  service_id: string | null
  is_paid: boolean
  feedback_id: string | null
  asking_payment: boolean
  payment_receipt_url: string | null
  prescription_id: string | null
  notify_patient: boolean
}

export interface Service {
  id: string
  name: string
  price: number
  type: 'consultation' | 'procedure' | 'diagnostic'
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Prescription {
  id: string
  appointment_id: string
  doctor_id: string
  patient_id: string
  prescription_file_url: string | null
  medication_details: string | null
  dosage_instructions: string | null
  additional_notes: string | null
  created_at: string
  updated_at: string
  notify_prescription: boolean
}

export interface Feedback {
  id: string
  appointment_id: string
  patient_id: string
  doctor_id: string
  overall_rating: number
  doctor_rating: number
  service_quality_rating: number
  communication_rating: number
  facility_rating: number
  positive_feedback: string | null
  negative_feedback: string | null
  suggestions: string | null
  additional_comments: string | null
  would_recommend: boolean
  experience_tags: string[] | null
  created_at: string
  updated_at: string
}