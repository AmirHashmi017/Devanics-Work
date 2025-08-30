'use client';
import { bg_style } from '@/globals/tailwindvariables';
import SettingSidebar from '../verticleBar';
import Materials from './components/Materials';
import { withAuth } from '@/app/hoc/withAuth';

function MaterialsPage() {
  return (
    <SettingSidebar>
      <section className={`${bg_style} p-5 w-full`}>
        <Materials />
      </section>
    </SettingSidebar>
  );
}

export default withAuth(MaterialsPage);
