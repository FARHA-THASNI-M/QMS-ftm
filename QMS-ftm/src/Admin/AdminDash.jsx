// AdminDash.jsx
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import Navbar from "./Navbar";
import { collection, getDocs, onSnapshot, orderBy, query, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import ManageCounterModal from "./ManageCounterModal";

const AdminDash = () => {
  const [userData, setUserData] = useState([]);
  const [counters, setCounters] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(
          query(collection(db, "requests"), orderBy("date", "asc"))
        );
        const data = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => isValidUserData(user));
        setUserData(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
    const unsubscribe = onSnapshot(
      query(collection(db, "requests"), orderBy("date", "asc")),
      (snapshot) => {
        const updatedData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((user) => isValidUserData(user));
        setUserData(updatedData);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCounters = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "counter"));
        const countersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCounters(countersData);
      } catch (error) {
        console.error("Error fetching counters: ", error);
      }
    };

    fetchCounters();
    const unsubscribeCounters = onSnapshot(collection(db, "counter"), fetchCounters);

    return () => unsubscribeCounters();
  }, []);

  const isValidUserData = (user) => {
    return (
      user.name &&
      user.date &&
      user.phone &&
      user.service &&
      user.counter &&
      user.token
    );
  };

  const handleEditCounter = async (counter) => {
    try {
      if (!selectedUser) return; // Ensure there is a selected user

      // Update the selected user's counter in Firebase
      await updateDoc(doc(db, "requests", selectedUser.id), {
        counter: counter.counterName // Assuming counterName is the name of the counter
      });

      // Update the selected user's counter in the local state
      setSelectedUser({
        ...selectedUser,
        counter: counter.counterName
      });
    } catch (error) {
      console.error("Error updating counter: ", error);
    }
  };

  return (
    <div className="md:mx-64 mx-2 md:py-16 py-16 flex flex-col min-h-64">
      <Navbar />
      <div className="flex flex-1 justify-center flex-wrap">
        <div className="flex flex-col items-center justify-center gap-10 w-full py-10">
          <ManageCounterModal
            selectedUser={selectedUser}
            counters={counters}
            onClose={() => setSelectedUser(null)}
            handleEditCounter={handleEditCounter} // Pass handleEditCounter as a prop
          />
        </div>
        <div className="flex flex-col items-center justify-center p-10 py-5 gap-4 w-full">
          <h2 className="font-semibold md:text-xl">Queue Details</h2>
          {userData.length === 0 ? (
            <p>No valid data available</p>
          ) : (
            <Table aria-label="Example static collection table">
              <TableHeader>
                <TableColumn>Sl. no.</TableColumn>
                <TableColumn>Name</TableColumn>
                <TableColumn>Phone</TableColumn>
                <TableColumn>Date</TableColumn>
                <TableColumn>Reason for Visit</TableColumn>
                <TableColumn>Counter</TableColumn>
                <TableColumn>Edit</TableColumn>
              </TableHeader>
              <TableBody>
                {userData.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      {user.date
                        ? user.date.toDate().toLocaleString()
                        : ""}
                    </TableCell>
                    <TableCell>{user.service}</TableCell>
                    <TableCell>{user.counter}</TableCell>
                    <TableCell>
                      <Button onClick={() => setSelectedUser(user)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDash;