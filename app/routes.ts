import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/applications', 'routes/applications.tsx'),
    route('/insights', 'routes/insights.tsx'),
    route('/auth', 'routes/auth.tsx'),
    route('/upload','routes/upload.tsx'),
    route('/resume/:id', 'routes/resume.tsx'),
    route('/wipe','routes/wipe.tsx'),
] satisfies RouteConfig;
