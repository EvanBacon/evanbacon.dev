import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <div className="container mx-auto px-4 md:px-0 bg-[#10141A]">
      <Slot />
    </div>
  );
}
