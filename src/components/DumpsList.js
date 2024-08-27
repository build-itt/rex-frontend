import React from 'react';
import "./BankList.css";

const DumpsList = ({ banks }) => {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Dumps Listings</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Balance</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank, index) => (
            <tr key={bank.id} className={`typing-row-${index + 1} border-t`}>
              <td className="px-4 py-2"><span className="table-typing">{bank.balance}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.description}</span></td>
              <td className="px-4 py-2"><span className="table-typing">{bank.price}</span></td>
              <td className="px-4 py-2">
                <button className="btn-primary">
                  Buy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DumpsList;
