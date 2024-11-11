
#!/bin/sh

# Start the development server with HTTPS support
exec npm run dev -- --host 0.0.0.0 --port 3001 --https
