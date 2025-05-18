# TetherHealth Chat Extension

A Chrome Extension that integrates Supabase authentication with Voiceflow chat capabilities.

## Features

- Supabase Authentication
- Organization-based Multi-tenancy
- Voiceflow Chat Integration
- Modern UI with Shadcn UI Components
- Dark/Light Theme Support

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Build the extension:
   ```bash
   npm run build
   ```

5. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` directory from your project

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Make changes to the code and the extension will automatically reload

## Supabase Schema

The extension expects the following tables in your Supabase database:

### Organizations Table
```sql
create table organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  project_id text not null,
  api_key text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### Profiles Table
```sql
create table profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  organization_id uuid references organizations not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## Usage

1. Install the extension in Chrome
2. Click the extension icon to open the popup
3. Log in with your Supabase credentials
4. Start chatting with the Voiceflow-powered assistant

## License

MIT 