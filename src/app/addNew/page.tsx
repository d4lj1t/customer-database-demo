'use client';

import { useRouter } from 'next/navigation'
import React, { useState } from 'react';
import styles from '@/app/styles/add-edit.module.scss';
import Link from 'next/link';
import {addNewCustomer} from '@/services/addNewCustomer';

export default function AddNewCustomer() {
	const router = useRouter();

	const [newCustomer, setNewCustomer] = useState({
		name: '',
		street: '',
		email: '',
		phone: '',
		age: '',
	});

	const handleInputChange = (field: string, value: string) => {
		setNewCustomer((prevCustomer) => ({
			...prevCustomer,
			[field]: value,
		}));
	};

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await addNewCustomer(newCustomer as any);
			router.push('/home');
		} catch (error) {
			console.log('Failed to update customer');
		}
	}

	return (
		<div className={styles.outerContainer}>
			<h1 className="heading2">Add Customer</h1>
			<form onSubmit={handleSave}>
				<label>
					<div>Name</div>
					<div>
						<input required onChange={(e) => handleInputChange('name', e.target.value)} />
					</div>
				</label>
				<label>
					<div>Street</div>
					<div>
						<input required onChange={(e) => handleInputChange('street', e.target.value)} />
					</div>
				</label>
				<label>
					<div>Email</div>
					<div>
						<input required onChange={(e) => handleInputChange('email', e.target.value)} />
					</div>
				</label>
				<label>
					<div>Phone</div>
					<div>
						<input required onChange={(e) => handleInputChange('phone', e.target.value)} />
					</div>
				</label>
				<label>
					<div>Age</div>
					<div>
						<input required onChange={(e) => handleInputChange('age', e.target.value)} />
					</div>
				</label>
				<div className={styles.buttonsContainer}>
					<Link href={`/home`}>
						<button type="reset" className="secondaryButton">Cancel</button>
					</Link>
					<button type="submit" className="primaryButton">Save</button>
				</div>
			</form>
		</div>
)};
