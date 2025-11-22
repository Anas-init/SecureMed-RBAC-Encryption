namespace First_Web_Api_App.Utilities
{
    public static class Anonymizer
    {
        public static string MaskName(string original)
        {
            return "ANON_" + Guid.NewGuid().ToString("N")[..4].ToUpper();
        }

        public static string MaskContact(string original)
        {
            if (original.Length < 4) return "XXXX";
            return "XXX-XXX-" + original[^4..];
        }
    }

}
