import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const useStore = create(persist(
  (set, get) => ({
      userName: '',
      userToken: '',
      userUsername: '',
      userExpires: '',
      message: '',
      openMessage: false,
      severityMessage: '',
      setError: (message) => set(state => ({ message, openMessage: true, severityMessage: 'error' })),
      setSuccess: (message) => set(state => ({ message, openMessage: true, severityMessage: 'success' })),
      closeMessage: () => set(state => ({ error: '', openMessage: false, severityMessage: '' })),
      setUserName: (name) => set(state => ({ userName: name })),
      setUserToken: (token) => set(state => ({ userToken: token })),
      setUserUsername: (name) => set(state => ({ userUsername: name })),
      setUserExpires: (token) => set(state => ({ userExpires: token })),
    }),
    {
      name: 'libraryApp',
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default useStore