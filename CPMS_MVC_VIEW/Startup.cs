using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CPMS_MVC_VIEW.Startup))]
namespace CPMS_MVC_VIEW
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
