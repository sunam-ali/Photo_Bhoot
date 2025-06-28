import { useContext } from 'react';
import { ProfileContext } from '../contexts';

export const useProfile = () => {
  return useContext(ProfileContext);
}    