export interface Area {
  id: string;
  name: string;
  areas: Area[];
}

export interface ResumeUploadProps {
  vacancyId: string;
  onClose: () => void;
}