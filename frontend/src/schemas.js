import * as Yup from 'yup';

export const fileContent = Yup.array(
  Yup.object().shape({
    Dport: Yup.number().required(),
    Dst: Yup.string().required(),
    Service: Yup.string().required(), // https/tcp etc.
    Sport: Yup.number().required(),
    Src: Yup.string().required(),
    Action: Yup.string().required(), // Allow/deny
  })
);
