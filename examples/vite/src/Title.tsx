type Props = {
  /**
   * Title of the component
   */
  title: string
}

export const Title = ({ title }: Props) => {
  return <h1>{title}</h1>
}
