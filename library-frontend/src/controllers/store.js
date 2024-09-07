import { create } from 'zustand'

const useStore = create((set) => ({
    message: '',
    openMessage: false,
    severityMessage: '',
    setError: (message) => set(state => ({ message, openMessage: true, severityMessage: 'error' })),
    setSuccess: (message) => set(state => ({ message, openMessage: true, severityMessage: 'success' })),
    closeMessage: () => set(state => ({ error: '', openMessage: false, severityMessage: '' }))
  })
)

export default useStore