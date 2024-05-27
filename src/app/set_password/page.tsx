import RegisterForm from '../ui/register-form';
import { Metadata } from 'next';
import Link from 'next/link';
import SetPasswordFrontend from '../_components/SetPasswordFrontend';

 
export const metadata: Metadata = {
  title: 'Set password',
};
 
export default function SetPassword() {
  return (
    <>
        <SetPasswordFrontend />
    </>
  )
}