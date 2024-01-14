'use client';

import React, {createContext, useState, Dispatch, SetStateAction, type ReactNode} from 'react';
import {type Customer} from '@/app/types';

type ContextType = {
	children: ReactNode;
	editCustomer?: Customer,
	setEditCustomer: Dispatch<SetStateAction<Customer | undefined>>
	editedCustomer?: Customer,
	setEditedCustomer: Dispatch<SetStateAction<Customer | undefined>>
};

export const Context = createContext<ContextType | undefined>(undefined);

export const GlobalStateProvider: React.FC<{children: ReactNode}> = ({children}) => {
	const [editCustomer, setEditCustomer] = useState<Customer | undefined>(undefined);
	const [editedCustomer, setEditedCustomer] = useState<Customer | undefined>(undefined);

	const contextValue: ContextType = {
		children,
		editCustomer,
		setEditCustomer,
		editedCustomer,
		setEditedCustomer
	};

	return (
		<Context.Provider value={contextValue}>
			{children}
		</Context.Provider>
	);
};

export default GlobalStateProvider;
