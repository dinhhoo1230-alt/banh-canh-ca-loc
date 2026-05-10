export default function CustomerHomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
      <span className="text-6xl mb-6">📱</span>
      <h2 className="text-2xl font-bold mb-3">Chào mừng đến quán!</h2>
      <p className="text-gray-600 mb-6">
        Vui lòng quét mã QR tại bàn của bạn để bắt đầu đặt món
      </p>
      <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl p-8">
        <span className="text-5xl">📷</span>
        <p className="text-amber-700 font-medium mt-3">Quét QR tại bàn</p>
      </div>
    </div>
  );
}
