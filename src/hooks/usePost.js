import { useContext } from 'react';
import { PostContext } from '../contexts';

export const usePost = () => {
  return useContext(PostContext)
}    