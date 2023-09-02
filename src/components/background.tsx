import styles from '@/styles/background.module.css';
import classNames from 'classnames';

export function Background() {
  return (
    <div className="z-[-1] fixed w-full h-full pointer-events-none pt-24 pb-32 px-4 md:px-0 flex justify-center">
      <div
        className={classNames(
          'absolute top-0 left-0 bottom-0 right-0',
          'bg-[url("/grid.svg")] opacity-30'
        )}
      />
      <div
        className={classNames(
          'flex-1 max-w-[640px]',
          'opacity-10',
          styles.complexGradient
        )}
      />
      <div
        className={classNames(
          'absolute top-0 left-0 bottom-0 right-0',
          styles.radialGradient
        )}
      />
    </div>
  );
}
