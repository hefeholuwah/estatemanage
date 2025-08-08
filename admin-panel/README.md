# Estate Management Admin Panel

A comprehensive web-based admin panel for managing estate management systems, providing complete control over estates, users, security personnel, and access control.

## 🚀 Features

### Estate Management
- ✅ Create, edit, and delete estates
- ✅ View all estates with detailed information
- ✅ Estate statistics and overview
- ✅ Contact information management
- ✅ Amenities and unit tracking

### User Management
- ✅ Create and manage estate users
- ✅ Assign users to specific estates
- ✅ Role-based access control (Admin, Resident, Staff)
- ✅ User profile management
- ✅ Bulk user operations

### Security Personnel Management
- ✅ Create and manage security personnel accounts
- ✅ Assign security to specific estates
- ✅ Shift management (Day, Night, 24h)
- ✅ Access level control (Basic, Advanced, Supervisor)
- ✅ Badge number tracking

### QR Code Verification Integration
- ✅ Estate-specific QR code generation
- ✅ Security personnel can only verify QR codes for their assigned estate
- ✅ Access control and verification logs
- ✅ QR code history tracking

### Global Admin Control
- ✅ View all estates in the system
- ✅ Manage all security personnel across estates
- ✅ Manage all estate user accounts
- ✅ Add/remove accounts as needed
- ✅ System-wide statistics and monitoring

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Forms**: React Hook Form

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd estatemanage/admin-panel
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

The admin panel is configured to connect to the backend API at `https://estatemanage.onrender.com/api`.

### Environment Variables

Create a `.env` file in the admin-panel directory:

```env
REACT_APP_API_URL=https://estatemanage.onrender.com/api
REACT_APP_ENV=development
```

## 📱 Usage

### Admin Login
1. Navigate to the admin panel
2. Use admin credentials to log in
3. Access the dashboard with system overview

### Estate Management
1. Go to "Estates" section
2. Click "Add Estate" to create new estates
3. Edit existing estates by clicking the edit icon
4. View estate details and statistics

### User Management
1. Navigate to "Users" section
2. Create new users with specific roles
3. Assign users to estates
4. Manage user permissions and access

### Security Management
1. Go to "Security" section
2. Add security personnel with access levels
3. Assign security to specific estates
4. Manage shifts and access control

## 🔐 Security Features

### Authentication
- JWT-based authentication
- Secure token storage
- Automatic token refresh
- Session management

### Access Control
- Role-based permissions
- Estate-specific access
- Security personnel verification
- QR code access control

### Data Protection
- HTTPS communication
- Secure API endpoints
- Input validation
- XSS protection

## 📊 Dashboard Features

### Statistics Overview
- Total estates count
- Active users count
- Security personnel count
- Today's visitors count

### System Monitoring
- Recent activities
- System alerts
- Performance metrics
- Error tracking

### Quick Actions
- Add new estate
- Create user
- Assign security
- View reports

## 🏗️ Architecture

```
admin-panel/
├── public/                 # Static files
├── src/
│   ├── components/         # Reusable components
│   ├── contexts/          # React contexts
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── utils/             # Utility functions
├── package.json
└── README.md
```

## 🔌 API Integration

The admin panel integrates with the backend API through the following services:

- **Authentication**: Admin login and session management
- **Estate Management**: CRUD operations for estates
- **User Management**: User creation, assignment, and management
- **Security Management**: Security personnel and access control
- **Dashboard**: Statistics and system overview

## 🎨 UI/UX Features

### Modern Design
- Clean and professional interface
- Responsive design for all devices
- Intuitive navigation
- Consistent styling with Tailwind CSS

### User Experience
- Real-time updates
- Loading states and spinners
- Toast notifications
- Form validation
- Error handling

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- Responsive design

## 🚀 Deployment

### Development
```bash
npm start
```

### Production Build
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables
3. Deploy automatically

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`

## 🔧 Development

### Adding New Features
1. Create new components in `src/components/`
2. Add new pages in `src/pages/`
3. Update API services in `src/services/`
4. Add routing in `src/App.js`

### Styling
- Use Tailwind CSS classes
- Follow the existing design system
- Maintain consistency across components

### State Management
- Use React Query for server state
- Use React Context for global state
- Keep local state minimal

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Check if the backend is running
   - Verify API URL in configuration
   - Check network connectivity

2. **Authentication Issues**
   - Clear browser storage
   - Check token expiration
   - Verify admin credentials

3. **Build Errors**
   - Clear node_modules and reinstall
   - Check for dependency conflicts
   - Verify Node.js version

### Debug Mode
Enable debug mode by setting:
```env
REACT_APP_DEBUG=true
```

## 📈 Performance

### Optimization
- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization
- Caching strategies

### Monitoring
- Error tracking
- Performance monitoring
- User analytics
- System health checks

## 🔄 Updates and Maintenance

### Regular Updates
- Keep dependencies updated
- Security patches
- Feature updates
- Bug fixes

### Backup Strategy
- Database backups
- Configuration backups
- Code version control
- Disaster recovery plan

## 📞 Support

For support and questions:
- Check the documentation
- Review the code comments
- Contact the development team
- Submit issues on GitHub

## 📄 License

This project is licensed under the MIT License.

---

**Estate Management Admin Panel** - Complete control over your estate management system. 