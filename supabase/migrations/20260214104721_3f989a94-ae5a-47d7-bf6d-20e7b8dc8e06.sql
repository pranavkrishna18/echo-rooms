
-- Chat requests table
CREATE TABLE public.chat_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_email TEXT NOT NULL,
  from_name TEXT NOT NULL,
  to_email TEXT NOT NULL,
  to_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Private messages table
CREATE TABLE public.private_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID NOT NULL REFERENCES public.chat_requests(id) ON DELETE CASCADE,
  sender_email TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  content TEXT NOT NULL,
  flagged_toxic BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.private_messages ENABLE ROW LEVEL SECURITY;

-- Since app uses localStorage auth (no Supabase Auth), allow anon access
-- In production, migrate to proper auth
CREATE POLICY "Allow all access to chat_requests" ON public.chat_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to private_messages" ON public.private_messages FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for private messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.private_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_requests;

-- Indexes
CREATE INDEX idx_chat_requests_to_email ON public.chat_requests(to_email);
CREATE INDEX idx_chat_requests_from_email ON public.chat_requests(from_email);
CREATE INDEX idx_private_messages_request_id ON public.private_messages(request_id);
