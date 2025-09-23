// Script to update some verification statuses for testing
// Run this in your browser console on the verifications page

async function updateVerificationStatus(verificationId, status) {
  try {
    const response = await fetch('/api/verifications', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        id: verificationId, 
        status: status,
        reviewer_notes: `Updated for testing - set to ${status}`
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update verification');
    }
    
    const result = await response.json();
    console.log('Updated verification:', result);
    return result;
  } catch (error) {
    console.error('Error updating verification:', error);
  }
}

// Example usage - replace with actual verification IDs from your database:
// updateVerificationStatus('ab7121c9-3d3f-42a9-8a59-9dc176fe890d', 'pending')
// updateVerificationStatus('48fe4fa3-a38e-4e1d-934c-1304df2fe73c', 'rejected')

console.log('Functions loaded. Use updateVerificationStatus(id, status) to test different statuses.');
console.log('Available statuses: "pending", "verified", "rejected"');