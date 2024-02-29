//Generates a list with unique values for Service/Port drop-down menu
const initializeUniqueServices = (initialData, networkPorts) => {
  const flattenArray = (arr) => {
      return Array.isArray(arr) ? arr.flatMap((item) => flattenArray(item)) : [arr];
  };

  const serviceOptions = [
    ...new Set(
        initialData.flatMap((row) =>
            Object.entries(row)
                .filter(([key]) => key === 'Service')
                .map(([, value]) => ({ Service: value.map(pair => pair[0]), Port: value.map(pair => pair[1]) })) // Adjusted here
        )
    ),
    ...networkPorts.map(([service, port]) => ({ Service: [service], Port: [port] })), // Adjusted here
  ];  

  const uniqueServicesSet = new Set();

  serviceOptions.forEach((option) => {
    const ports = Array.isArray(option.Port) ? option.Port : [option.Port] || [];
    const services = flattenArray(option.Service);
    services.forEach((service) => {
        ports.forEach((port) => {
            uniqueServicesSet.add(JSON.stringify([service, port])); // Adjusted here
        });
    });
  });

  const uniqueServicesArray = [...uniqueServicesSet].map((pair) => JSON.parse(pair));
  console.log('Unique: ', uniqueServicesArray);
  return uniqueServicesArray;
};

export default initializeUniqueServices;