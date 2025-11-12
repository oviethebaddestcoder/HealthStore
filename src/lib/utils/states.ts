export const nigerianStates = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
]

// Nearby states to Lagos (South West region) - cheaper delivery
const nearbyStates = ['Ogun', 'Oyo', 'Osun', 'Ondo', 'Ekiti', 'Edo']

export const calculateDeliveryFee = (state: string): number => {
  if (!state) return 9000 // Default fee if no state provided
  
  const normalizedState = state.trim()
  
  // Lagos delivery - ₦3,500
  if (normalizedState.toLowerCase() === 'lagos') {
    return 10000
  }
  
  // Nearby states (South West) - ₦5,000
  if (nearbyStates.some(s => s.toLowerCase() === normalizedState.toLowerCase())) {
    return 23000
  }
  
  // Other states - ₦6,000
  return 27000
}

export const validateNigerianState = (state: string): boolean => {
  return nigerianStates.some(s => s.toLowerCase() === state.toLowerCase())
}

// Helper function to get delivery fee description
export const getDeliveryFeeInfo = (state: string): { fee: number; label: string } => {
  const fee = calculateDeliveryFee(state)
  const normalizedState = state?.trim().toLowerCase()
  
  if (normalizedState === 'lagos') {
    return {
      fee,
      label: 'Lagos Delivery'
    }
  } else if (nearbyStates.some(s => s.toLowerCase() === normalizedState)) {
    return {
      fee,
      label: 'Nearby States Delivery'
    }
  } else {
    return {
      fee,
      label: 'Standard Delivery'
    }
  }
}

// Helper to format delivery fee for display
export const formatDeliveryFee = (state: string): string => {
  const fee = calculateDeliveryFee(state)
  return `₦${fee.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}