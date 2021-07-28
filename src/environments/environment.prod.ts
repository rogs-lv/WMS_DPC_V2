export const environment = {
  production: true,
  urlApi: 'https://apiwms/serviceWMS/wms/',
  urlSL: 'https://hanab1:50000/b1s/v1/',
  credentials: window['credentials'] || { UserName: 'manager', Password: 'eviciti', CompanyDB: 'DESARROLLOS21' },
  dataForRequests: window['dataForRequests'] || { WhsForRequest: 'CICPR', InterWhs: 'TRANSITO'}
};
