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
	const [customerAdded, setCustomerAdded] = useState(false);
	const [addedCustomer, setAddedCustomer] = useState<Customer | undefined>(undefined);

	const {editCustomer, setEditCustomer} = useContext(Context) || {};
	const {editedCustomer, setEditedCustomer} = useContext(Context) || {};
	const {customerList, setCustomerList} = useContext(Context) || {};

	const handleEditClick = (person: Customer) => {
		if (setEditCustomer) {
			setEditCustomer(person);
		}
	}

	const handleAddNewClick = () => {
		if (setCustomerList) {
			setCustomerList(customers);
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
			const element = document.querySelector(`[data-id='${editedCustomer?._id}']`);
			if (element) {
				element.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
				});
			}
			const timer = setTimeout(() => {
				setCustomerUpdated(false);
				if (setEditCustomer && setEditedCustomer) {
					setEditCustomer(undefined);
					setEditedCustomer(undefined);
				}
			}, 3000);
			return () => clearTimeout(timer);
		}
	}, [customers, editCustomer, editedCustomer, setEditCustomer, setEditedCustomer]);

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

				const customerListSet = new Set(customerList?.map(item => item._id));

				const addedItem = data.find(item => !customerListSet.has(item._id));

				setCustomerAdded(customerList !== null && addedItem !== undefined);

				if (addedItem && customerList) {
					setAddedCustomer(addedItem);

					const timer = setTimeout(() => {
						setCustomerAdded(false);
						setAddedCustomer(undefined);
						if (setCustomerList) {
							setCustomerList(null);
						}
					}, 3000);
					return () => clearTimeout(timer);
				}
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

	useEffect(() => {
		const element = document.querySelector(`[data-id='${addedCustomer?._id}']`);
		if (element) {
			element.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	}, [addedCustomer]);

	return (
		<>
			<section className={styles.outerContainer}>
				<h1 className={styles.pageHeading}>Customer Records</h1>
				<Link href={'/addNew'}>
					<button onClick={() => handleAddNewClick()} className="primaryButton mt-5">Add New</button>
				</Link>
				{loading && <Loading />}
				{customers && customers.length > 0 && (
					<section className={styles.cardsContainer}>
						{customers.map((person, index) => (
							<section className={`${styles.customerCard} ${person._id?.toString() === editCustomer?._id?.toString() && customerUpdated && styles.updated} ${person._id?.toString() === addedCustomer?._id?.toString() && customerAdded && styles.updated}`} key={index} data-id={person._id}>
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
