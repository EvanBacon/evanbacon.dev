import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <div className="container mx-auto">
      <Slot />
    </div>
  );
}
