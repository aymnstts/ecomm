'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import storeLogo from "@/assets/logo_store.png";
import shippingLogo from "@/assets/logo_shipping.png";

export default function StoreOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [printQueue, setPrintQueue] = useState([])
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false)
    const [orderToDelete, setOrderToDelete] = useState(null)

    const { getToken } = useAuth()

    const fetchOrders = async () => {
       try {
        const token = await getToken()
        const { data } = await axios.get('/api/store/orders', {headers: { Authorization: `Bearer ${token}` }})
        setOrders(data.orders)
       } catch (error) {
        toast.error(error?.response?.data?.error || error.message)
       }finally{
        setLoading(false)
       }
    }

    const updateOrderStatus = async (orderId, status) => {
        try {
            const token = await getToken()
            await axios.post('/api/store/orders',{orderId, status}, {headers: { Authorization: `Bearer ${token}` }})
            setOrders(prev =>
                prev.map(order => 
                    order.id === orderId ? {...order, status} : order
                )
            )
            toast.success('Order status updated!')
       } catch (error) {
            toast.error(error?.response?.data?.error || error.message)
       }
    }

        //  / Updated deleteOrder function - opens confirmation modal
        const openDeleteConfirm = (orderId, e) => {
        e.stopPropagation()
        setOrderToDelete(orderId)
        setDeleteConfirmModal(true)
        }

        const confirmDelete = async () => {
        try {
            const token = await getToken()
            await axios.delete(`/api/store/orders?orderId=${orderToDelete}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            
            setOrders(prev => prev.filter(order => order.id !== orderToDelete))
            toast.success('Order deleted successfully!')
            setDeleteConfirmModal(false)
            setOrderToDelete(null)
        } catch (error) {
            console.error('Delete error:', error)
            toast.error(error?.response?.data?.error || error.message)
        }
        }

const cancelDelete = () => {
    setDeleteConfirmModal(false)
    setOrderToDelete(null)
}

    const openModal = (order) => {
        setSelectedOrder(order)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setSelectedOrder(null)
        setIsModalOpen(false)
    }

    const printSingleOrder = (order, e) => {
        e.stopPropagation()
        setPrintQueue([order])
        setTimeout(() => {
            window.print()
            setPrintQueue([])
        }, 100)
    }

    const printAllConfirmed = () => {
        const confirmedOrders = orders.filter(order => order.status === 'PROCESSING')
        if (confirmedOrders.length === 0) {
            toast.error('No confirmed orders to print')
            return
        }
        setPrintQueue(confirmedOrders)
        setTimeout(() => {
            window.print()
            setPrintQueue([])
        }, 100)
    }

    const printReceipt = () => {
        setPrintQueue([selectedOrder])
        setTimeout(() => {
            window.print()
            setPrintQueue([])
        }, 100)
    }

    const ReceiptComponent = ({ order }) => (
        <div className="print-receipt-item" style={{ pageBreakAfter: 'always' }}>
            <div style={{ width: '4in', height: '6in', margin: '0', padding: '0.3in', fontSize: '9pt', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box', overflow: 'hidden' }}>
                {/* Header with Logos */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', paddingBottom: '8px', borderBottom: '2px solid #000' }}>
                   <img src={storeLogo.src} alt="Store Logo" style={{ height: '35px', width: 'auto' }} />
                    <img src={shippingLogo.src} alt="Shipping Logo" style={{ height: '35px', width: 'auto' }} />
                </div>

                {/* Receipt Title */}
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                    <h2 style={{ margin: '0', fontSize: '14pt', fontWeight: 'bold' }}>SHIPPING RECEIPT</h2>
                    <p style={{ margin: '5px 0 0 0', fontSize: '8pt', color: '#666' }}>Order #{order.id}</p>
                </div>

                {/* Sender & Receiver Info */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px', fontSize: '8pt' }}>
                    <div style={{ border: '1px solid #000', padding: '8px', borderRadius: '4px' }}>
                        <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '9pt' }}>FROM:</p>
                        <p style={{ margin: '2px 0', fontWeight: 'bold' }}>Aura Parfums</p>
                        <p style={{ margin: '2px 0' }}>Marrakech, 45000</p>
                        <p style={{ margin: '2px 0' }}>+212 6 16 11 42 60</p>
                    </div>
                    <div style={{ border: '1px solid #000', padding: '8px', borderRadius: '4px' }}>
                        <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '9pt' }}>TO:</p>
                        <p style={{ margin: '2px 0', fontWeight: 'bold' }}>{order.user?.name}</p>
                        <p style={{ margin: '2px 0' }}>{order.address?.street}</p>
                        <p style={{ margin: '2px 0' }}>{order.address?.city}, {order.address?.zip}</p>
                        <p style={{ margin: '2px 0' }}>{order.address?.country}</p>
                        <p style={{ margin: '2px 0' }}>Tel: {order.address?.phone}</p>
                    </div>
                </div>

                {/* Order Items */}
                <div style={{ marginBottom: '12px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '10pt', fontWeight: 'bold', borderBottom: '1px solid #000', paddingBottom: '3px' }}>PRODUCTS</h3>
                    <table style={{ width: '100%', fontSize: '8pt', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
                                <th style={{ textAlign: 'left', padding: '4px', fontWeight: 'bold' }}>Product</th>
                                <th style={{ textAlign: 'center', padding: '4px', fontWeight: 'bold' }}>Qty</th>
                                <th style={{ textAlign: 'right', padding: '4px', fontWeight: 'bold' }}>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.orderItems.map((item, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '4px' }}>{item.product?.name}</td>
                                    <td style={{ textAlign: 'center', padding: '4px' }}>{item.quantity}</td>
                                    <td style={{ textAlign: 'right', padding: '4px' }}>{item.price} MAD</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Total */}
                <div style={{ marginBottom: '15px', fontSize: '10pt', paddingTop: '10px', borderTop: '2px solid #000' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                        <span style={{ fontWeight: 'bold' }}>TOTAL:</span>
                        <span style={{ fontWeight: 'bold', fontSize: '12pt' }}>{order.total} MAD</span>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ fontSize: '7pt', textAlign: 'center', paddingTop: '12px', borderTop: '1px solid #ccc', color: '#666' }}>
                    <p style={{ margin: '0 0 2px 0' }}>Thank you for your order!</p>
                    <p style={{ margin: '0' }}>aurafragrance1@gmail.com</p>
                    <p style={{ margin: '0' }}>WhatsApp: +212 7 10 83 72 12</p>
                </div>
            </div>
        </div>
    )

    useEffect(() => {
        fetchOrders()
    }, [])

    if (loading) return <Loading />

    const confirmedOrdersCount = orders.filter(order => order.status === 'PROCESSING').length

    return (
        <>
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl text-slate-500">Store <span className="text-slate-800 font-medium">Orders</span></h1>
                <div className="flex gap-2">
                    <button
                        onClick={printAllConfirmed}
                        disabled={confirmedOrdersCount === 0}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors flex items-center gap-2 ${
                            confirmedOrdersCount === 0 
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                        </svg>
                        Bulk Print ({confirmedOrdersCount})
                    </button>
                </div>
            </div>

            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <div className="overflow-x-auto max-w-5xl rounded-md shadow border border-gray-200">
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
                            <tr>
                                {["Sr. No.", "Customer", "Total", "Payment", "Coupon", "Status", "Date", "Action"].map((heading, i) => (
                                    <th key={i} className="px-4 py-3">{heading}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order, index) => (
                                <tr
                                    key={order.id}
                                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                    onClick={() => openModal(order)}
                                >
                                    <td className="pl-6 text-green-600">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3">{order.user?.name}</td>
                                    <td className="px-4 py-3 font-medium text-slate-800">{order.total} MAD</td>
                                    <td className="px-4 py-3">{order.paymentMethod}</td>
                                    <td className="px-4 py-3">
                                        {order.isCouponUsed ? (
                                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                                                {order.coupon?.code}
                                            </span>
                                        ) : (
                                            "—"
                                        )}
                                    </td>
                                    <td className="px-4 py-3" onClick={(e) => { e.stopPropagation() }}>
                                        <select
                                            value={order.status}
                                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                                            className="border-gray-300 rounded-md text-sm focus:ring focus:ring-blue-200"
                                        >
                                            <option value="ORDER_PLACED">ORDER_PLACED</option>
                                            <option value="PROCESSING">Confirmed</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => printSingleOrder(order, e)}
                                                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Print Receipt"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                                <button
                                                onClick={(e) => openDeleteConfirm(order.id, e)}
                                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                title="Delete Order"
                                                >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && selectedOrder && (
                <div onClick={closeModal} className="fixed inset-0 flex items-center justify-center bg-black/50 text-slate-700 text-sm backdrop-blur-xs z-50" >
                    <div onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
                        <h2 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                            Order Details
                        </h2>

                        {/* Customer Details */}
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Customer Details</h3>
                            <p><span className="text-green-700">Name:</span> {selectedOrder.user?.name}</p>
                            <p><span className="text-green-700">Email:</span> {selectedOrder.user?.email}</p>
                            <p><span className="text-green-700">Phone:</span> {selectedOrder.address?.phone}</p>
                            <p><span className="text-green-700">Address:</span> {`${selectedOrder.address?.street}, ${selectedOrder.address?.city}, ${selectedOrder.address?.state}, ${selectedOrder.address?.zip}, ${selectedOrder.address?.country}`}</p>
                        </div>

                        {/* Products */}
                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Products</h3>
                            <div className="space-y-2">
                                {selectedOrder.orderItems.map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 border border-slate-100 shadow rounded p-2">
                                        <img
                                            src={item.product?.images?.[0]}
                                            alt={item.product?.name}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="text-slate-800">{item.product?.name}</p>
                                            <p>Qty: {item.quantity}</p>
                                            <p>Price: {item.price} MAD</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment & Status */}
                        <div className="mb-4">
                            <p><span className="text-green-700">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                            <p><span className="text-green-700">Paid:</span> {selectedOrder.isPaid ? "Yes" : "No"}</p>
                            {selectedOrder.isCouponUsed && (
                                <p><span className="text-green-700">Coupon:</span> {selectedOrder.coupon.code} ({selectedOrder.coupon.discount}% off)</p>
                            )}
                            <p><span className="text-green-700">Status:</span> {selectedOrder.status}</p>
                            <p><span className="text-green-700">Order Date:</span> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2">
                            <button 
                                onClick={printReceipt} 
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Print Receipt
                            </button>
                            <button 
                                onClick={closeModal} 
                                className="px-4 py-2 bg-slate-200 rounded hover:bg-slate-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteConfirmModal && (
    <div onClick={cancelDelete} className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div onClick={e => e.stopPropagation()} className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Delete Order</h3>
                    <p className="text-sm text-gray-500">Order #{orderToDelete}</p>
                </div>
            </div>
            
            <p className="text-gray-600 mb-6">
                Are you sure you want to delete this order? This action cannot be undone and all order data will be permanently removed.
            </p>
            
            <div className="flex gap-3 justify-end">
                <button
                    onClick={cancelDelete}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                    Cancel
                </button>
                <button
                    onClick={confirmDelete}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                    Delete Order
                </button>
            </div>
        </div>
    </div>
)}

            {/* Print-only Receipts */}
            <div className="print-receipt" style={{ display: 'none' }}>
                {printQueue.map((order, idx) => (
                    <ReceiptComponent key={order.id} order={order} />
                ))}
            </div>
        </>
    )
}