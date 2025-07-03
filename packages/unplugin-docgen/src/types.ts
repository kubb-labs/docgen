export type Options = {
  /**
   * @default process.cwd()
   */
  root?: string
  /**
   * Path to the `tsconfig.json` file, relative to the root
   * @default 'tsconfig.json'
   */
  tsconfig?: string
  output?:{
    /**
     * @default '.'
     */
    path?: string
  }
}
