export const environment = {
  production: true,
  urlApi: `https://${window['serviceURL']}/serviceWMS/wms/`,
  urlSL: `https://${window['serverHana']}/b1s/v1/`,
  credentials: window['credentials'] || { UserName: 'manager', Password: 'eviciti', CompanyDB: 'DESARROLLOS21' },
  dataForRequests: window['dataForRequests'] || { WhsForRequest: 'CICPR', InterWhs: 'TRANSITO'}
};
