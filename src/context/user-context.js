import { createContext, useState } from "react";

const userContext = createContext();

export function UserProvider({ children }) {
	const [clgcode, setclgcode] = useState(1021001);
	return (
		<userContext.Provider value={{ clgcode: clgcode }}>
			{children}
		</userContext.Provider>
	);
}

export default userContext;
