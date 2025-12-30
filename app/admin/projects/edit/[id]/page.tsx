
import ProjectEditor from "../../_components/ProjectEditor"

type PageProps = {
  params: Promise<{ id?: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default function EditProjectPage(props: PageProps) {
  return <ProjectEditor {...props} />
}
