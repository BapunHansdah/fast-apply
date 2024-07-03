const DynamicUI = ({ data }:any) => {
  const renderValue = (value:any) => {
    if (Array.isArray(value)) {
      return (
        <ul>
          {value.map((item, index) => (
            <li  key={index}>{renderValue(item)}</li>
          ))}
        </ul>
      );
    } else if (typeof value === 'object' && value !== null) {
      return (
        <div className="flex flex-wrap text-xs" >
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="flex flex-col">
              <strong>{key}:</strong> <div >{renderValue(val)}</div> 
            </div>
          ))}
        </div>
      );
    } else {
      return <span className="text-xs">{value}</span>
      // return value.length <50 ? <input value={value}  className="border p-1 text-xs"></input>: <textarea value={value}  className="border p-1 text-xs"></textarea>
    }
  };

  return <div className="">{renderValue(data)}</div>;
};



export default DynamicUI;