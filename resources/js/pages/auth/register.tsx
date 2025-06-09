import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import Turnstile from '@/components/turnstile';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    cf_turnstile_response: string;
};

interface RegisterProps {
    turnstile_site_key: string;
}

export default function Register({ turnstile_site_key }: RegisterProps) {
    const [turnstileToken, setTurnstileToken] = useState<string>('');
    const [turnstileError, setTurnstileError] = useState<boolean>(false);
    const turnstileRef = useRef<{ reset: () => void }>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        turnstile_site_key: '',
    });

    const handleTurnstileVerified = (token: string) => {
        console.log('Turnstile verification successful');
        setTurnstileToken(token);
        setData('cf_turnstile_response', token);
        setTurnstileError(false);
        clearErrors('cf_turnstile_response');
    };

    const handleTurnstileError = () => {
        console.error('Turnstile verification failed');
        setTurnstileToken('');
        setData('cf_turnstile_response', '');
        setTurnstileError(true);
    };

    const handleTurnstileExpired = () => {
        console.log('Turnstile token expired');
        setTurnstileToken('');
        setData('cf_turnstile_response', '');
        setTurnstileError(true);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (!turnstileToken) {
            setTurnstileError(true);
            return;
        }

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
            onError: (errors) => {
                console.error('Login failed:', errors);
                setTurnstileToken('');
                setData('cf_turnstile_response', '');
                setTurnstileError(true);

                setTimeout(() => {
                    turnstileRef.current?.reset();
                }, 100);
            }
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            disabled={processing}
                            placeholder="Full name"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={2}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Password"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirm password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirm password"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <div className="flex justify-center">
                        <Turnstile
                            ref={turnstileRef}
                            siteKey={turnstile_site_key}
                            onVerified={handleTurnstileVerified}
                            onError={handleTurnstileError}
                            onExpired={handleTurnstileExpired}
                            theme="light"
                            size="normal"
                            className={turnstileError || errors.cf_turnstile_response ? 'border border-red-500 rounded p-2' : ''}
                        />
                    </div>

                    <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')} tabIndex={6}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
