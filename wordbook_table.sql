--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: wordbook; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wordbook (
    id integer NOT NULL,
    wordbook_name character varying(255) NOT NULL,
    user_email character varying(255),
    num_of_words integer DEFAULT 0
);


ALTER TABLE public.wordbook OWNER TO postgres;

--
-- Name: wordbook_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wordbook_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wordbook_id_seq OWNER TO postgres;

--
-- Name: wordbook_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wordbook_id_seq OWNED BY public.wordbook.id;


--
-- Name: wordbook id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wordbook ALTER COLUMN id SET DEFAULT nextval('public.wordbook_id_seq'::regclass);


--
-- Data for Name: wordbook; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wordbook (id, wordbook_name, user_email, num_of_words) FROM stdin;
1	first wordbook	user@example.com	0
\.


--
-- Name: wordbook_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wordbook_id_seq', 1, true);


--
-- Name: wordbook wordbook_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wordbook
    ADD CONSTRAINT wordbook_pkey PRIMARY KEY (id);


--
-- Name: wordbook wordbook_user_email_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wordbook
    ADD CONSTRAINT wordbook_user_email_fkey FOREIGN KEY (user_email) REFERENCES public.users(email) ON DELETE CASCADE;


--
-- Name: TABLE wordbook; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.wordbook TO yuma;


--
-- Name: SEQUENCE wordbook_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.wordbook_id_seq TO yuma;


--
-- PostgreSQL database dump complete
--

