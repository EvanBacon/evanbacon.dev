// Create types for CSS modules
declare module '*.mdx' {
  function Component(props: any): JSX.Element;
  export default Component;
}
