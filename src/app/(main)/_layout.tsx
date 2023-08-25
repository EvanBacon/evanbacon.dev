import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <div className="container mx-auto bg-[#10141A]">
      <Slot />
    </div>
  );
}
