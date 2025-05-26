const dummyPurchaseHistory = [
  { id: 1, order_id: `#${Math.floor(Math.random() * 10000)}`, product: "eBook Desain Web Modern", date: "10 Mei 2025", price: "Rp 150.000", status: "Selesai" },
  { id: 2, order_id: `#${Math.floor(Math.random() * 10000)}`, product: "Template Landing Page Premium", date: "5 Mei 2025", price: "Rp 350.000", status: "Selesai" },
  { id: 3, order_id: `#${Math.floor(Math.random() * 10000)}`, product: "Plugin WordPress SEO", date: "28 April 2025", price: "Rp 200.000", status: "Dalam Proses" },
  { id: 4, order_id: `#${Math.floor(Math.random() * 10000)}`, product: "Kursus Digital Marketing", date: "15 April 2025", price: "Rp 500.000", status: "Selesai" },
];

export const PurchaseHistoryContent = () => (
  <div className="bg-white">
    <h2 className="text-xl font-bold mb-6">Riwayat Pembelian</h2>
    <div className="overflow-x-auto">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Order</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummyPurchaseHistory.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.order_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Selesai' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-orange-600 hover:text-orange-900">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
