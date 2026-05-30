import { MaterialIcon } from "../../components/teacher-icons";

export function QuestionPromoSection() {
  return (
    <div className="grid grid-cols-1 gap-gutter md:grid-cols-3">
      <div className="group relative h-48 overflow-hidden rounded-lg bg-primary-container md:col-span-2">
        <img
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuPnAkgcTccBdnwi6pPLbS_q3F7J9Os_Zs9V5sp2uX9RoDVsROkpCnvveXKfDqZ1yveH4N1RgFJxK-433hwkAVHnHRZPKXDBOK7j0y7aqBoyYyiLmo6MBP4KR_CdXJQF0-ZSAuSbIQ7bHbORAAkdsdByuoDXJ9ww0Y7rVbnOPmIbcEvJ7catjdMkofjngVlY3rGm8ofaM-7o9ntvC682AvaCql7MDdBWiXXAPRn7D0rlJoqowhssFbIhTs46klEy9r_lVrRt2AUUM"
        />
        <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-primary-container to-transparent p-gutter">
          <h3 className="text-headline-md font-semibold text-white">
            Hệ thống AI gợi ý câu hỏi
          </h3>
          <p className="mt-2 max-w-md text-body-md text-white/70">
            Sử dụng trí tuệ nhân tạo để phân loại và kiểm tra tính trùng lặp của
            ngân hàng câu hỏi tự động.
          </p>
          <button
            className="mt-4 w-fit rounded-lg bg-secondary-container px-4 py-2 text-label-md font-medium text-on-secondary-container transition hover:bg-secondary-fixed-dim"
            type="button"
          >
            Kích hoạt ngay
          </button>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border border-secondary-container/50 bg-secondary-container/20 p-gutter text-center">
        <MaterialIcon className="mb-2 text-[48px] text-secondary">
          auto_awesome
        </MaterialIcon>
        <h4 className="text-headline-md font-semibold text-secondary">Hỗ trợ 24/7</h4>
        <p className="mt-1 text-body-md text-on-secondary-container/80">
          Liên hệ đội ngũ kỹ thuật nếu bạn gặp khó khăn khi import dữ liệu.
        </p>
      </div>
    </div>
  );
}
