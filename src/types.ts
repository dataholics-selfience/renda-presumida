export interface RendaResultType {
  cargo: string;
  empresa: string;
  localidade: string;
  salario_estimado: {
    min: string;
    max: string;
    media: string;
    fonte: string;
  };
  nivel: string;
  porte_empresa: string;
  alerta_fraude: string;
  inputData?: {
    cargo: string;
    empresa: string;
    localidade: string;
    salario_declarado: string;
  };
}