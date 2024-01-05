import cn from 'classnames';

export default function CenterInFull({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'pt-4 md:pt-8 container mx-auto px-4 md:px-6 lg:px-0 max-w-3xl',
        className
      )}
    >
      {children}
    </div>
  );
}
