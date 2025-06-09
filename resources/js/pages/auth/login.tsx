import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import React, { FormEvent, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import Turnstile from '@/components/turnstile';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
    cf_turnstile_response: string;
}

interface LoginProps {
    canResetPassword: boolean;
    status?: string;
    turnstile_site_key: string;
}

export default function Login({
    canResetPassword,
    status,
    turnstile_site_key
}: LoginProps) {
    const [turnstileToken, setTurnstileToken] = useState<string>('');
    const [turnstileError, setTurnstileError] = useState<boolean>(false);
    const turnstileRef = useRef<{ reset: () => void }>(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
        cf_turnstile_response: '',
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

    const submit = (e: FormEvent) => {
        e.preventDefault();

        if (!turnstileToken) {
            setTurnstileError(true);
            return;
        }

        // console.log('Submitting login form with turnstile token');

        post(route('login'), {
            onFinish: () => {
                reset('password');
            },
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
        <AuthLayout
            title="Log in to your account"
            description="Enter your email and password below to log in"
        >
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                            className={errors.email ? 'border-red-500' : ''}
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            {canResetPassword && (
                                <TextLink
                                    href={route('password.request')}
                                    className="ml-auto text-sm"
                                    tabIndex={5}
                                >
                                    Forgot password?
                                </TextLink>
                            )}
                        </div>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                            className={errors.password ? 'border-red-500' : ''}
                        />
                        <InputError message={errors.password} />
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

                    {(turnstileError || errors.cf_turnstile_response) && (
                        <div className="text-red-600 text-sm text-center">
                            {errors.cf_turnstile_response || 'Please complete the human verification.'}
                        </div>
                    )}

                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            name="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', !!checked)}
                            tabIndex={3}
                        />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        tabIndex={4}
                        disabled={processing || !turnstileToken}
                    >
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                        Log in
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Don't have an account?{' '}
                    <TextLink href={route('register')} tabIndex={6}>
                        Sign up
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
