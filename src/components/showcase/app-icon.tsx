import styles from '@/styles/showcase.module.scss';

const Div = 'div';
const Img = 'img';

const altSafe = (name: string) => name.replace('–', '-');
export function AppIcon({ iconUrl, name }: { iconUrl: string; name: string }) {
  return (
    <Div className={'relative object-cover ' + styles.appContainer}>
      <Img
        style={{
          filter: 'blur(20px) opacity(0.7)',
          WebkitFilter: 'blur(20px) opacity(0.7)',
        }}
        draggable={false}
        className={
          'absolute top-0 left-0 bottom-0 right-0 object-cover ' +
          styles.iconShadow
        }
        src={iconUrl}
      />
      <Img
        draggable={false}
        style={{ zIndex: 1 }}
        className={'object-cover ' + styles.appIcon}
        src={iconUrl}
        alt={`${altSafe(name)} icon`}
      />
    </Div>
  );
}
