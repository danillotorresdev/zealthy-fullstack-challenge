"use client";

import { useQuery } from "@tanstack/react-query";
import { User } from "@/types";
import { fetchUsers } from "@/utils/fetchers";

const DataTable = () => {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 0, 
    retry: 1, 
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-xl font-bold">Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-red-500 text-xl font-bold">
          Error: {error.message}
        </h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-5xl p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold mb-4">User Data</h1>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Email</th>
              <th className="border p-2">About Me</th>
              <th className="border p-2">Birthdate</th>
              <th className="border p-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => (
                <tr key={user.id}>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.aboutMe}</td>
                  <td className="border p-2">
                    {user.birthdate
                      ? new Date(user.birthdate).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="border p-2">
                    {user.address
                      ? `${user.address.street}, ${user.address.city}, ${user.address.state} ${user.address.zip}`
                      : "N/A"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
