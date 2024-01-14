'use client';

import React, {useState, useEffect, useContext} from 'react';
import Link from 'next/link';
import {Context} from '@/app/context';
import Loading from '@/app/home/loading';
import styles from './styles.module.scss';
import {baseApiUrl} from '@/app/constants';
import {Customer} from '@/app/types';

type ErrorResponse = {
	error: string;
};


export default function Home() {
	const [customers, setCustomers] = useState<Array<Customer> | null>(null);
	const [loading, setLoading] = useState(true);
	const [customerUpdated, setCustomerUpdated] = useState(false);

	const {editCustomer, setEditCustomer} = useContext(Context) || {};
	const {editedCustomer, setEditedCustomer} = useContext(Context) || {};

	const handleEditClick = (person: Customer) => {
		if (setEditCustomer) {
			setEditCustomer(person);
		}
	}

	useEffect(() => {
		const getEditedCustomer = customers?.find((customer) => customer._id === editCustomer?._id);

		if (setEditedCustomer) {
			setEditedCustomer(getEditedCustomer);
		}

		const hasDataChanged =
			editCustomer?.name !== editedCustomer?.name ||
			editCustomer?.street !== editedCustomer?.street ||
			editCustomer?.email !== editedCustomer?.email ||
			editCustomer?.phone !== editedCustomer?.phone ||
			editCustomer?.age !== editedCustomer?.age;

		setCustomerUpdated(hasDataChanged);

		if (hasDataChanged) {
			const timer = setTimeout(() => {
				setCustomerUpdated(false);
				if (setEditCustomer && setEditedCustomer) {
					setEditCustomer(undefined);
					setEditedCustomer(undefined);
				}
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, []);

	useEffect(() =>  {
		(async () => {
			try {
				const res = await fetch(`${baseApiUrl}/api/customers/getAll`, {
					method: 'GET',
				})

				if (!res.ok) {
					throw new Error(`HTTP error! Status: ${res.status}`);
				}

				const data = await res.json() as Customer[];
				setCustomers(data);
			} catch (error) {
				console.error('Error fetching customer:', error);
				const errorMessage = error instanceof Error && error.message ? error.message : 'Failed to fetch customers';
				const errorResponse: ErrorResponse = {error: errorMessage};

				return errorResponse;
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<>
			<section className={styles.outerContainer}>
				<h1 className={styles.pageHeading}>Customer Records</h1>
				<Link href={'/addNew'}>
					<button className="primaryButton mt-5">Add New</button>
				</Link>
				{loading && <Loading />}
				{customers && customers.length > 0 && (
					<section className={styles.cardsContainer}>
						{customers.map((person, index) => (
							<section className={`${styles.customerCard} ${person._id.toString() === editCustomer?._id.toString() && customerUpdated && styles.updated}`} key={index} data-id={person._id}>
								<section>
									<div>Name</div>
									<div>{String(person.name)}</div>
								</section>
								<section>
									<div>Street</div>
									<div>{String(person.street)}</div>
								</section>
								<section>
									<div>Email</div>
									<div>{String(person.email)}</div>
								</section>
								<section>
									<div>Phone</div>
									<div>{String(person.phone)}</div>
								</section>
								<section>
									<div>Age</div>
									<div>{String(person.age)}</div>
								</section>
								<div className={styles.buttonContainer}>
									<Link href={`/edit/${person._id}`}>
										<button onClick={() => handleEditClick(person)} className="secondaryButton">Edit</button>
									</Link>
								</div>
							</section>
						))}
					</section>
				)}
			</section>
		</>
	);
}
