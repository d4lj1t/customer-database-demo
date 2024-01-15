'use client';

import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react';
import {getCustomer} from '@/services/getCustomer';
import styles from '@/app/styles/add-edit.module.scss';
import {Customer} from '@/app/types';
import Link from 'next/link';
import {updateCustomer} from '@/services/updateCustomer';
import {deleteCustomer} from '@/services/deleteCustomer';

export default function EditCustomer({params}: {
	params: {
		id: string,
	}
}) {
	const [customer, setCustomer] = useState<Customer | null>(null);
	const customerId = params.id;

	const [editedData, setEditedData] = useState({
		_id: customerId,
		name: customer?.name || '',
		street: customer?.street || '',
		email: customer?.email || '',
		phone: customer?.phone || '',
		age: customer?.age || '',
	});

	const handleInputChange = (fieldName: string, value: string) => {
		setEditedData((prevData) => ({
			...prevData,
			[fieldName]: value,
		}));
	};

	const handleSave = async (customer: Customer, e: React.FormEvent) => {
		e.preventDefault();
		try {
			await updateCustomer(customer);
			router.push('/home');
		} catch (error) {
			console.log('Failed to update customer');
		}
	}

	const handleDelete = async () => {
		try {
			await deleteCustomer(customerId.toString());
			router.push('/home');
		} catch (error) {
			console.log('Failed to delete customer');
		}
	}

	const router = useRouter();

	useEffect(() => {
		(async () => {
			try {
				const response = await getCustomer(customerId as string);
				if ('name' in response) {
					setCustomer(response);

					setEditedData({
						_id: customerId,
						name: response.name || '',
						street: response.street || '',
						email: response.email || '',
						phone: response.phone || '',
						age: response.age || '',
					});
				} else {
					console.log('Failed to fetch customer:', response.error);
					setCustomer(null);
				}
			} catch (error) {
				console.log('Failed to fetch customer:', error);
			}
		})();
	}, []);

	if (!customer) {
		return <div>Loading...</div>;
	}

	return (
		<div className={styles.outerContainer}>
			<h1 className="heading2">Edit Customer</h1>
			<form onSubmit={async (e) => handleSave(editedData as Customer, e)}>
				<label>
					<div>Name</div>
					<div>
						<input required type="text" name="name" value={String(editedData.name)} onChange={(e) => handleInputChange('name', e.target.value)} />
					</div>
				</label>
				<label>
					<div>Street</div>
					<div>
						<input type="text" name="street" required value={String(editedData.street)} onChange={(e) => handleInputChange('street', e.target.value)} />
					</div>
				</label>
				<label>
					<div>Email</div>
					<div>
						<input type="email" name="email" required value={String(editedData.email)} onChange={(e) => handleInputChange('email', e.target.value)} />
					</div>
				</label>
				<label>
					<div>Phone</div>
					<div>
						<input type="tel" name="telephone" required value={String(editedData.phone)} onChange={(e) => handleInputChange('phone', e.target.value)} />
					</div>
				</label>
				<label>
					<div>Age</div>
					<div>
						<input type="number" name="age" min="1" max="120" required value={String(editedData.age)} onChange={(e) => handleInputChange('age', e.target.value)} />
					</div>
				</label>
				<div className={styles.buttonsContainer}>
					<Link href={`/home`}>
						<button type="reset" className="secondaryButton">Cancel</button>
					</Link>
					{customer.userId && (
						<Link href={`/home`}>
							<button onClick={() => handleDelete()} className="secondaryButton">Delete</button>
						</Link>
					)}
					<button type="submit" className="primaryButton">Save</button>
				</div>
			</form>
		</div>
)};
