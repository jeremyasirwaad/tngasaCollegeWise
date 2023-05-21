import { createContext, useState } from "react";



const userContext = createContext();

export function UserProvider({ children }) {
	const [clgcode, setClgcode] = useState(0);
	const [cname, setCname] = useState("");
	return (
		<userContext.Provider
			value={{
				clgcode: clgcode,
				setuserclgcode: setClgcode,
				cname: cname,
				setClgcode: setClgcode
			}}
		>
			{children}
		</userContext.Provider>
	);
}

export default userContext;
