import * as Yup from 'yup';

// TODO: refine the validation based on what fields we actually need & validate ip address fields?
export const fileContent = Yup.array(
  Yup.object().shape({
    Dport: Yup.number().required(),
    Dst: Yup.string().required(),
    IpVersion: Yup.number().required(),
    NodeId: Yup.string().required(),
    Protocol: Yup.number().required(),
    Service: Yup.string().required(),
    SituationId: Yup.number().required(),
    Situation: Yup.string().required(),
    Sport: Yup.number().required(),
    Src: Yup.string().required(),
    Action: Yup.string().required(),
    Facility: Yup.string().required(),
    SrcVlan: Yup.number().required(),
    EthType: Yup.number().required(),
  })
);
