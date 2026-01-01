import { useAuth } from '../contexts/AuthContext';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      {/* Topbar */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-playfair text-3xl font-medium tracking-wide text-white m-0">
            Settings
          </h1>
          <p className="text-white/[0.78] text-[13px] mt-1.5 font-light">
            Manage system settings and preferences
          </p>
        </div>
        <button className="btn-primary px-4 py-2.5 rounded-[14px] text-[13px]">
          Save All
        </button>
      </div>

      {/* Profile Section */}
      <fieldset className="glass-panel rounded-2xl p-5 mb-4 border border-white/[0.14]">
        <legend className="text-[11px] font-medium text-white/80 uppercase tracking-[0.12em] px-2">
          Profile Information
        </legend>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium text-white border border-white/[0.18] flex-shrink-0"
            style={{ background: 'radial-gradient(circle at 35% 30%, rgba(120,170,240,0.45), rgba(255,255,255,0.10))' }}
          >
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <p className="text-white font-medium">{user?.email}</p>
            <span className="badge badge-info text-[10px] mt-1">
              {user?.role}
            </span>
          </div>
        </div>
      </fieldset>

      {/* Restaurant Settings */}
      <fieldset className="glass-panel rounded-2xl p-5 mb-4 border border-white/[0.14]">
        <legend className="text-[11px] font-medium text-white/80 uppercase tracking-[0.12em] px-2">
          Restaurant Settings
        </legend>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Restaurant Name
            </label>
            <input
              type="text"
              defaultValue="Fine Dining Restaurant"
              className="input-premium w-full"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="input-premium w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Opening Time
            </label>
            <input
              type="time"
              defaultValue="11:00"
              className="input-premium w-full"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Closing Time
            </label>
            <input
              type="time"
              defaultValue="22:00"
              className="input-premium w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
            Address
          </label>
          <textarea
            rows={2}
            defaultValue="123 Main Street, City, State 12345"
            className="input-premium w-full resize-none"
          />
        </div>

        <button className="btn-primary px-4 py-2 rounded-[14px] text-[13px]">
          Save Settings
        </button>
      </fieldset>

      {/* Reservation Settings */}
      <fieldset className="glass-panel rounded-2xl p-5 mb-4 border border-white/[0.14]">
        <legend className="text-[11px] font-medium text-white/80 uppercase tracking-[0.12em] px-2">
          Reservation Settings
        </legend>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Min Advance Booking (Hours)
            </label>
            <input
              type="number"
              defaultValue="2"
              min="0"
              className="input-premium w-full"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
              Max Advance Booking (Days)
            </label>
            <input
              type="number"
              defaultValue="30"
              min="1"
              className="input-premium w-full"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-[11px] font-medium text-white/70 uppercase tracking-wider mb-2">
            Default Reservation Duration (Minutes)
          </label>
          <input
            type="number"
            defaultValue="120"
            step="30"
            className="input-premium w-full"
          />
        </div>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="autoConfirm"
            defaultChecked
            className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#cfd4dc] focus:ring-[#cfd4dc]/30"
          />
          <label htmlFor="autoConfirm" className="text-[13px] text-white/80">
            Auto-confirm reservations
          </label>
        </div>

        <button className="btn-primary px-4 py-2 rounded-[14px] text-[13px]">
          Save Settings
        </button>
      </fieldset>

      {/* Notification Settings */}
      <fieldset className="glass-panel rounded-2xl p-5 border border-white/[0.14]">
        <legend className="text-[11px] font-medium text-white/80 uppercase tracking-[0.12em] px-2">
          Notifications
        </legend>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-white/80">Email notifications for new reservations</label>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#cfd4dc] focus:ring-[#cfd4dc]/30"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-white/80">Email notifications for cancellations</label>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#cfd4dc] focus:ring-[#cfd4dc]/30"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-white/80">Send reservation reminders</label>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#cfd4dc] focus:ring-[#cfd4dc]/30"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-[13px] text-white/80">Kitchen display alerts</label>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#cfd4dc] focus:ring-[#cfd4dc]/30"
            />
          </div>
        </div>

        <button className="btn-primary px-4 py-2 rounded-[14px] text-[13px] mt-4">
          Save Settings
        </button>
      </fieldset>
    </div>
  );
}
