const originalError = console.error;

console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Warning: ') && 
      (args[0].includes('defaultProps will be removed') || 
       args[0].includes('YAxis:') || 
       args[0].includes('XAxis:'))) {
    return;
  }
  originalError.apply(console, args);
};